import React, { useState } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const UploadMaterial = ({ courseId, onUploadSuccess }) => {
    const [materialName, setMaterialName] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!materialName || !file) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        AWS.config.update({
            accessKeyId: 'AKIAQEIP3NBUO6NGDFRI',
            secretAccessKey: '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',
            region: 'eu-north-1' 
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'pedagoplanetuploadfile',
            Key: file.name,
            Body: file,
            ACL: 'public-read'
        };

        try {
        
            const uploadResult = await s3.upload(params).promise();
            const fileUrl = uploadResult.Location;

           
            await axios.post('http://localhost:8080/api/materials', {
                name: materialName,
                url: fileUrl,
                courseId: courseId
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            onUploadSuccess();
        } catch (error) {
            console.error('Error uploading file:', error);
            if (error.response) {
                console.error('Response error:', error.response.data);
            } else if (error.request) {
                console.error('Request error:', error.request);
            } else {
                console.error('General error:', error.message);
            }
            alert('Erreur lors du téléchargement du fichier. Vérifiez les journaux pour plus de détails.');
        }
    };

    return (
        <Dialog open onClose={onUploadSuccess}>
            <DialogTitle>Ajouter un matériel</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="material-name"
                    label="Nom du matériel"
                    type="text"
                    fullWidth
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                />
                <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                    <Button variant="contained" component="span">
                        Télécharger PDF
                    </Button>
                    {file && file.name}
                </label>
            </DialogContent>
            <DialogActions>
                <Button onClick={onUploadSuccess} color="secondary">
                    Annuler
                </Button>
                <Button onClick={handleUpload} color="primary">
                    Enregistrer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadMaterial;
