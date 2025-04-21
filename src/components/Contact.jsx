import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const ContactIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  margin: theme.spacing(0, 0.5),
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-3px)',
    color: theme.palette.primary.dark,
    backgroundColor: 'rgba(26, 82, 118, 0.1)',
  },
}));

const ContactLinks = ({ githubUrl, linkedinUrl, email }) => {
  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };
  
  const ensureHttpProtocol = (url) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="GitHub" arrow>
        <ContactIconButton
          href={ensureHttpProtocol(githubUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <GitHubIcon />
        </ContactIconButton>
      </Tooltip>
      
      <Tooltip title="LinkedIn" arrow>
        <ContactIconButton
          href={ensureHttpProtocol(linkedinUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <LinkedInIcon />
        </ContactIconButton>
      </Tooltip>
      
      <Tooltip title="Email" arrow>
        <ContactIconButton
          onClick={handleEmailClick}
          aria-label="Send email"
        >
          <EmailIcon />
        </ContactIconButton>
      </Tooltip>
    </Box>
  );
};

export default ContactLinks;