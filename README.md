# AWS S3 file editor

Using this you can edit text files in S3 buckets. 


## Usage

 - Clone repository `git clone https://github.com/mapalagama93/aws-s3-file-editor.git`
 - Run `npm install`
 - Make sure you have setup `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as env variables.
 - Run `node edit.js  {BUCKET_NAME}   {FILE_PATH}   {EDITOR}`
    
    eg :
 `node edit.js my.bucket.com dir1/xyz/hello.json nano`  
 This will download file from s3 and open it with nano editor. Once you save the file it will re-upload to s3 bucket again.
