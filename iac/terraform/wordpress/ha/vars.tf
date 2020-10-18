variable "ec2_keypair_name" {
  type    = string
  default = "wordpress_keypair"
}

variable "ec2_ami" {
  type    = string
  default = "ami-07a29e5e945228fa1" # ubuntu image
}

variable "ec2_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "db_instance_type" {
  type    = string
  default = "db.t2.micro"
}

variable "db_username" {
  type    = string
  default = "user"
}

variable "db_password" {
  type    = string
  default = "abc123456"
}

variable "db_name" {
  type    = string
  default = "wordpress_db"
}

variable "db_allocated_storage" {
  type = number
  default = 5
}

variable "instanceTenancy" {
    default = "default"
}

variable "dnsSupport" {
    default = true
}

variable "dnsHostNames" {
    default = true
}

variable "vpcCIDRblock" {
    default = "10.0.0.0/16"
}

variable "subnets_cidr" {
	type = list
	default = ["10.0.1.0/24", "10.0.2.0/24"]
}
