import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import { motion } from 'framer-motion';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


const ContributorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.18)',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  width: 320,
  maxWidth: '90vw',
  overflow: 'hidden',
  border: '1px solid rgba(26, 82, 118, 0.1)',
}));

const ContributorButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: 50,
  height: 50,
}));

const ContactIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: theme.spacing(0.7),
  '&:hover': {
    backgroundColor: 'rgba(26, 82, 118, 0.1)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
}));

const ContributorBox = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: 'rgba(26, 82, 118, 0.06)',
    border: '1px solid rgba(26, 82, 118, 0.08)',
    transform: 'translateX(4px)',
  },
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56, 
  marginRight: theme.spacing(2), 
  border: '2px solid #1a5276',
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ContributorName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.dark,
  fontSize: '1.05rem',
}));

const ContributorRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  marginBottom: theme.spacing(0.5),
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  borderBottom: '2px solid #1a5276',
  paddingBottom: theme.spacing(1),
  color: '#1a5276',
  fontWeight: 600,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '40%',
    height: '2px',
    backgroundColor: theme.palette.primary.light,
  }
}));

const ProjectContributors = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'contributors-popover' : undefined;

  const contributors = [
    {
      name: 'Abdeljabbar Elgaddari',
      role: 'Lead Developer',
      email: 'abdeljabbarelgaddari7@outlook.com',
      github: 'https://github.com/AbdeljabarELGaDDaRi',
      linkedin: 'https://www.linkedin.com/in/Geogueddari',
      image: 'src/assets/abdeljabbar.jpg',
    },
    {
      name: 'Yassin Bouazzaoui',
      role: 'UX Designer',
      email: 'bouazzaouiyassin@mui.com',
      github: 'https://github.com/yassinbouazzaoui',
      linkedin: 'https://www.linkedin.com/in/yassine-bouazzaoui-302345272',
      image: 'src/assets/yassine.jpg',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <Tooltip title="Project Contributors" arrow placement="left">
        <ContributorButton
          aria-describedby={id}
          onClick={handleClick}
          size="large"
        >
          <GroupsIcon fontSize="medium" />
        </ContributorButton>
      </Tooltip>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left', 
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            overflow: 'visible',
            mt: 0,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: '50%',
              right: -10,
              width: 20,
              height: 20,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              boxShadow: '3px -3px 5px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
      >
        <ContributorPaper elevation={isMobile ? 2 : 6}>
          <HeaderTypography variant="h6" gutterBottom>
            Project Contributors
          </HeaderTypography>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contributors.map((contributor, index) => (
              <ContributorBox 
                key={index}
                variants={itemVariants}
              >
                <AvatarStyled
                  src={contributor.image}
                  alt={contributor.name}
                />
                <Box>
                  <ContributorName variant="subtitle1">
                    {contributor.name}
                  </ContributorName>
                  <ContributorRole variant="body2">
                    {contributor.role}
                  </ContributorRole>
                  <Stack direction="row" spacing={0.8}>
                    <Tooltip title="GitHub" arrow>
                      <ContactIconButton 
                        href={contributor.github}
                        target="_blank" 
                        rel="noopener noreferrer"
                        size="small"
                      >
                        <GitHubIcon fontSize="small" />
                      </ContactIconButton>
                    </Tooltip>
                    <Tooltip title="LinkedIn" arrow>
                      <ContactIconButton 
                        href={contributor.linkedin}
                        target="_blank" 
                        rel="noopener noreferrer"
                        size="small"
                      >
                        <LinkedInIcon fontSize="small" />
                      </ContactIconButton>
                    </Tooltip>
                    <Tooltip title="Email" arrow>
                      <ContactIconButton 
                        href={`mailto:${contributor.email}`}
                        size="small"
                      >
                        <EmailIcon fontSize="small" />
                      </ContactIconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </ContributorBox>
            ))}
          </motion.div>
          
          <Typography 
            variant="caption" 
            display="block" 
            textAlign="center" 
            sx={{ 
              mt: 3, 
              color: 'text.secondary',
              fontStyle: 'italic',
              opacity: 0.8 
            }}
          >
            © 2025 Jarar Maps - EHTP
          </Typography>
        </ContributorPaper>
      </Popover>
    </>
  );
};

export default ProjectContributors;