resource "aws_security_group" "wordpress_sg" {
  description = "Enable HTTP access via port 80 locked down to the load balancer + SSH access"
  ingress {
    from_port = 80
    protocol = "tcp"
    to_port = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 22
    protocol = "tcp"
    to_port = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
  vpc_id = aws_vpc.Wordpress_vpc.id
  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "wordpress" {
  ami           = var.ec2_ami
  instance_type = var.ec2_instance_type
  key_name = var.ec2_keypair_name
  depends_on = [aws_security_group.wordpress_sg, aws_security_group.wordpress_db_sg, aws_db_instance.db]
  subnet_id = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.wordpress_sg.id]
  user_data = <<-EOT
              #!/bin/bash
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
