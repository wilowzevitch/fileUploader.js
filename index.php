<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>uploadFile.js</title>
    <input id="file" type="file" name="" />
</head>
<body>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script type="text/javascript"  src="fileUploader.js"></script>
	<script type="text/javascript">
        $(function() {
            $("#file").fileUploader({
                url: 'processing.php',
                beforeUpload: function(formData) {
                    formData.append("nom", 'valeur');
                    return true;
                },
                processing: function(percent) {
                    console.log('Processing ... '+percent+'%');
                },
                success: function() {
                    console.log('PERFECT');
                }
            });
        });
    </script>
</body>
</html>