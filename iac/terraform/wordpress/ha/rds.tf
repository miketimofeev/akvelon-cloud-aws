resource "aws_security_group" "wordpress_db_sg" {
  description = "Open database for access"
  vpc_id = var.vpc_id
  ingress {
    from_port = 3306
    protocol = "tcp"
    to_port = 3306
    security_groups = [
      aws_security_group.wordpress_sg.id]
  }
  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "db" {
  name = var.db_name
  engine = "MySQL"
  multi_az = false
  username = var.db_username
  password = var.db_password
  instance_class = var.db_instance_type
  allocated_storage = var.db_allocated_storage
  depends_on = [
    aws_security_group.wordpress_db_sg]
  vpc_security_group_ids = [
    aws_security_group.wordpress_db_sg.id]
  skip_final_snapshot = true
}