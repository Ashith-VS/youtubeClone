import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { UrlEndPoint } from '../../http/apiConfig';
import networkRequest from '../../http/api';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from "uuid"
import { storage } from '../../services/firebase';
import { Container, Wrapper, Title, Input, Desc, Button, Label, ErrorMessage } from "../../assets/css/upload"

const UploadVideo = () => {
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        tags: [],
        imgUrl: '',
        videoUrl: ''
    })
    const [percentage, setPercentage] = useState({
        imgPercentage: 0,
        videoPercentage: 0,
    })

    const handleValidation = () => {
        const { title, desc, tags, videoUrl, imgUrl } = formData;
        let errors = {};
        if (!title || title.trim() === '') {
            errors.title = 'Title is required';
        }
        if (!desc || desc.trim() === '') {
            errors.desc = 'Description is required';
        }
        if (!tags.length) {
            errors.tags = 'At least one tag is required';
        }
        if (!videoUrl) {
            errors.videoUrl = 'Video is required';
        }
        if (!imgUrl) {
            errors.imgUrl = 'Image is required';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = handleValidation();
        if (!isEmpty(valid)) {
            setError(valid)
        } else {
            try {
                const url = UrlEndPoint.addVideo;
                const res = await networkRequest({ url, method: 'post', data: formData });
                if (res) {
                    console.log('res: ', res);
                    navigate(`/video/${res._id}`);
                }
            } catch (error) {
                console.error('Error during upload or API call:', error);
            }
        }
    };

    const uploadFile = (file, urlType) => {
        const filename = `${file?.name}_${uuid()}`// Generate a unique name using UUID
        const storageRef = ref(storage, `youtubeClone/${filename}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setPercentage((prev) => ({ ...prev, [urlType === 'imgUrl' ? 'imgPercentage' : 'videoPercentage']: Math.round(progress) }));
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData((prev) => ({ ...prev, [urlType]: downloadURL }));
                });
            }
        )
    }
    return (
        <Container>
            <Wrapper>
                <Title>Upload  a New Video</Title>
                <Label>Video:</Label>
                {percentage.videoPercentage > 0 ? ("Uploading:" + percentage?.videoPercentage + '%') : (<>
                    <Input type="file" accept='video/*' id="file" onChange={(e) => {
                        uploadFile(e.target.files[0], 'videoUrl');
                        setError({ ...error, videoUrl: '' })
                    }} />
                    {error.videoUrl && <ErrorMessage>{error.videoUrl}</ErrorMessage>}
                </>)}
                <Input type="text" placeholder='Title' name='title' onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    setError({ ...error, title: '' })
                }} />
                {error.title && <ErrorMessage>{error.title}</ErrorMessage>}
                <Desc placeholder="Description" name="desc" rows={8} onChange={(e) => {
                    setFormData({ ...formData, desc: e.target.value })
                    setError({ ...error, desc: '' })
                }} />
                {error.desc && <ErrorMessage>{error.desc}</ErrorMessage>}
                <Input type="text" placeholder="Separate the tags with commas." name="tags" onChange={(e) => {
                    setFormData({ ...formData, tags: e.target.value.split(",") })
                    setError({ ...error, tags: '' })
                }} />
                {error.tags && <ErrorMessage>{error.tags}</ErrorMessage>}
                <Label>Image:</Label>
                {percentage?.imgPercentage > 0 ? ("Uploading:" + percentage?.imgPercentage + '%') : (<>
                    <Input type="file" accept='image/*' id="image" onChange={(e) => {
                        uploadFile(e.target.files[0], 'imgUrl');
                        setError({ ...error, imgUrl: '' })
                    }} />
                    {error.imgUrl && <ErrorMessage>{error.imgUrl}</ErrorMessage>}
                </>)}
                <Button onClick={handleSubmit}>Upload</Button>
            </Wrapper>
        </Container>
    )
}

export default UploadVideo