terraform apply -var="vpc_id=vpc-e816318f" \
  -var="ec2_keypair_name=wordpress_key_pair" \
  -var="s3_source_bucket=akvelon-demo-1602013928848-source" \
  -var="s3_target_bucket=akvelon-demo-1602013928848-target" \
  -var="sqs_bucket_put_ev_queue=akvelon-demo-1602013928848-bucket-put-image-ev"

