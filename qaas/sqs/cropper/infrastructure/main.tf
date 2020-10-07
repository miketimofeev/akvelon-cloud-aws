provider "aws" {
  region = "eu-west-1"
  version = "3.5.0"
}

output "sqs" {
  value = aws_sqs_queue.bucket_put_ev_queue.id
}
