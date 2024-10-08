import React from 'react';
import {
    Container,
    ErrorCode,
    Message,
    Description,
    StyledLink
} from '../../assets/css/notfound'


const NotFoundPage = () => {
    return (
        <Container>
            <ErrorCode>404</ErrorCode>
            <Message>Page Not Found</Message>
            <Description>
                Oops! The page you are looking for doesn't exist or has been moved.
            </Description>
            <StyledLink to="/">Go Back Home</StyledLink>
        </Container>
    );
};

export default NotFoundPage;

