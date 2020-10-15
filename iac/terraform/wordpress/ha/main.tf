provider "aws" {
  region = "us-west-2"
  version = "3.8.0"
}

output "website" {
  value = aws_lb.app_load_balancer.dns_name
}
