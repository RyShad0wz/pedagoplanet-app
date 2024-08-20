import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Typography } from '@mui/material';

const NewsItem = ({ title, content, date }) => {
    return (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="textSecondary">{date}</Typography>
            <Typography variant="body1">{content}</Typography>
        </Paper>
    );
};

const NewsCarousel = ({ news }) => {
    return (
        <Carousel>
            {news.map((item, index) => (
                <NewsItem 
                    key={index} 
                    title={item.title} 
                    content={item.content} 
                    date={item.date} 
                />
            ))}
        </Carousel>
    );
};

export default NewsCarousel;
