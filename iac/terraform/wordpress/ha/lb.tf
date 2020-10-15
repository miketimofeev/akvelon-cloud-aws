resource "aws_security_group" "alb_sg" {
  description = "Application Load Balancer SG"
  ingress {
    from_port = 80
    protocol = "tcp"
    to_port = 80
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

resource "aws_lb_target_group" "alb_tg" {
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

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
  depends_on         = [aws_security_group.alb_sg]
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.subnet_ids
}

resource "aws_lb_listener" "alb_listener" {
  load_balancer_arn = aws_lb.app_load_balancer.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type              = "forward"
    target_group_arn  = aws_lb_target_group.alb_tg.arn
  }

  depends_on = [aws_lb.app_load_balancer, aws_lb_target_group.alb_tg]
}