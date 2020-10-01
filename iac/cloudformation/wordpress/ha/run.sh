aws cloudformation --region us-west-2 create-stack --stack-name mystack-ha --disable-rollback --template-body file://wordpress_template.yaml --cli-input-json file://input.json
