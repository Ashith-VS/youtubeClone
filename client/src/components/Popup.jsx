import React from 'react'
import { Container, Wrapper, Close, Title, Input, Desc, Button, Label } from "../assets/css/popup"
const Popup = ({setOpen}) => {
    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>x</Close>
                <Title>Upload a New Video</Title>
                <Input type="file" accept='video/*' id="file" />
                <Input type="text" placeholder='Title' name='title' />
                <Desc placeholder="Description" name="desc" rows={8}/>

            </Wrapper>
        </Container>
    )
}

export default Popup