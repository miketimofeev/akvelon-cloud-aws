resource "aws_security_group" "alb_sg" {
  description = "Application Load Balancer SG"
  vpc_id = aws_vpc.Wordpress_vpc.id
  ingress {
    from_port = 80
    protocol = "tcp"
    to_port = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "alb_tg" {
  port     = 80
  protocol = "HTTP"
  vpc_id = aws_vpc.Wordpress_vpc.id
  health_check {
      path                = "/wp-admin/install.php"
      interval            = 10
      timeout             = 5
      healthy_threshold   = 2
      unhealthy_threshold = 5
  }
  stickiness {
      enabled         = true
      type            = "lb_cookie"
      cookie_duration = 30 
  }
}

resource "aws_lb" "app_load_balancer" {
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.public.*.id
}

resource "aws_lb_listener" "alb_listener" {
  load_balancer_arn = aws_lb.app_load_balancer.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type              = "forward"
    target_group_arn  = aws_lb_target_group.alb_tg.arn
  }
}