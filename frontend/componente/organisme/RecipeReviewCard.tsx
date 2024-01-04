import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard(props: any) {
  const [expanded, setExpanded] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { animalName, 
    animalType, 
    animalBreed, 
    birthDate, 
    gender, 
    weight, 
    description,
    images, 
  } = props;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={animalName}
        subheader={animalType}
      />
       <div style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="194"
          image={images[currentImageIndex]}
          alt="Dish image"
          style={{ objectFit: 'contain' }}
        />
        <IconButton
          aria-label="previous image"
          onClick={handlePreviousImage}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
           <ArrowBackIosIcon /> {/* Iconiță pentru imaginea anterioară */}
        </IconButton>
        <IconButton
          aria-label="next image"
          onClick={handleNextImage}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
           <ArrowForwardIosIcon /> {/* Iconiță pentru următoarea imagine */}
        </IconButton>
      </div>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {animalBreed}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
        <Typography variant="h5" component="div">
          {animalName}
        </Typography>
        <Typography color="text.secondary">
          Tip de Animal: {animalType}
        </Typography>
        <Typography color="text.secondary">
          Rasa Animalului: {animalBreed}
        </Typography>
        <Typography color="text.secondary">
          Data nașterii: {birthDate}
        </Typography>
        <Typography color="text.secondary">
          Gen: {gender === 'female' ? 'Femelă' : 'Mascul'}
        </Typography>
        <Typography color="text.secondary">
          Greutate: {weight}
        </Typography>
        <Typography variant="body2">
          Descriere: {description}
        </Typography>
      </CardContent>
      </Collapse>
    </Card>
  );
}