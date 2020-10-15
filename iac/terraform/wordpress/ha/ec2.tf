resource "aws_security_group" "wordpress_sg" {
  description = "Enable HTTP access via port 80 locked down to the load balancer + SSH access"
  ingress {
    from_port = 80
    protocol = "tcp"
    to_port = 80
    security_groups = [aws_security_group.alb_sg.id]
  }
  ingress {
    from_port = 22
    protocol = "tcp"
    to_port = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
  vpc_id = var.vpc_id
  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# how to get region from provider configuration
resource "aws_launch_configuration" "autoscaling_conf" {
  name            = "autoscaling-launch-conf-wordpress"
  key_name        = var.ec2_keypair_name
  image_id        = var.ec2_ami
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.wordpress_sg.id]
  depends_on      = [aws_security_group.wordpress_sg, aws_security_group.wordpress_db_sg, aws_db_instance.db]

  user_data = <<-EOT
            #!/bin/bash -x
            # Install the files and packages from the metadata
            apt-get update -y
            apt-get install -y python-pip
            apt-get install -y python-setuptools
            mkdir -p /opt/aws/bin
            python /usr/lib/python2.7/dist-packages/easy_install.py --script-dir /opt/aws/bin https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-latest.tar.gz
            sudo apt-get update
            sudo apt-get install -y php7.2-fpm nginx-full php-mysql
            sudo mkdir -p /var/www/wordpress
            curl -L http://wordpress.org/latest.tar.gz > wordpress.tar.gz
            sudo tar -zxf wordpress.tar.gz -C /var/www/
            sudo rm /etc/nginx/sites-available/default
            echo 'server {
            listen 80 default_server;
            listen [::]:80 default_server;
            root /var/www/wordpress;
            index index.php index.html index.htm;
            server_name _;
            location / {
            try_files $uri $uri/ =404;
            }
            location ~ .php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
            }
            }' > default
            sudo cp default /etc/nginx/sites-available/
            sudo service php7.2-fpm restart
            sudo service nginx restart
            sudo cp /var/www/wordpress/wp-config-sample.php /var/www/wordpress/wp-config.php
            sudo sed -i "s/'database_name_here'/'${var.db_name}'/g" /var/www/wordpress/wp-config.php
            sudo sed -i "s/'username_here'/'${var.db_username}'/g" /var/www/wordpress/wp-config.php
            sudo sed -i "s/'password_here'/'${var.db_password}'/g" /var/www/wordpress/wp-config.php
            sudo sed -i "s/'localhost'/'${aws_db_instance.db.endpoint}'/g" /var/www/wordpress/wp-config.php
  EOT
}

resource "aws_autoscaling_group" "autoscaling_g" {
  name                 = "autoscaling-group-wordpress"
  launch_configuration = aws_launch_configuration.autoscaling_conf.name
  min_size             = 1
  max_size             = 2
  desired_capacity     = 1
  vpc_zone_identifier  = var.subnet_ids
  target_group_arns    = [aws_lb_target_group.alb_tg.arn]
}

resource "aws_autoscaling_policy" "autoscaling_policy" {
  name                   = "autoscaling-policy-wordpress"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  policy_type            = "SimpleScaling"
  cooldown               = 30
  autoscaling_group_name = aws_autoscaling_group.autoscaling_g.name
}