variable "ec2_keypair_name" {
  type    = string
  default = "app_keypair"
}

variable "ec2_ami" {
  type    = string
  default = "ami-0701e7be9b2a77600" # ubuntu image
}

variable "ec2_instance_type" {
  type    = string
  default = "t2.small"
}

variable "vpc_id" {
  type    = string
  default = ""
}

variable "s3_source_bucket" {
  type    = string
  default = ""
}

variable "s3_target_bucket" {
  type    = string
  default = ""
}

variable "sqs_bucket_put_ev_queue" {
  type    = string
  default = ""
}
