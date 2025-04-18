import * as React from 'react';
import { createTheme, useTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import SearchBar from './SearchBar';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import "./DashboardLayoutBasic.css"

import Typography from '@mui/material/Typography';
//import Grid from '@mui/material/Grid';

import {
  // Icônes de base
  School as SchoolIcon,
  Map as MapIcon,
  Engineering as EngineeringIcon,
  Public as PublicIcon,
  WbSunny as WbSunnyIcon,
  ElectricBolt as ElectricBoltIcon,
  HomeWork as HomeWorkIcon,
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  Layers as LayersIcon,
  MapOutlined as MapOutlinedIcon,
  MiscellaneousServices as MiscellaneousServicesIcon,
  LibraryBooks as LibraryBooksIcon,
  LocalBar as LocalBarIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  
  // Icônes sportives
  SportsSoccer as SoccerIcon,
  SportsVolleyball as VolleyIcon,
  SportsBasketball as BasketballIcon,
  SportsTennis as TennisIcon,
  
} from '@mui/icons-material';



import Map from "./Map"

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    background: {
      default: '#F1F3F4', // beige
      paper: '#e5e7eb',   // beige clair pour les composants sur fond 'paper'
    },
  },
});

const NAVIGATION = [
  {
    kind:'header',
    title:'Layers'
  },
  {
    kind: 'header',
    title: <SearchBar demoTheme={demoTheme} />,
    sx: { 
      bgcolor: '#1a5276', 
      color: 'white',
      fontWeight: 'bold',
      pl: 2,
      pt:2,
      borderRadius: 1,
    },
  },

  {
    kind: 'divider',
    sx: { my: 1, borderColor: '#1a5276' }
  },
  {
    segment: 'formations',
    title: 'Formations EHTP',
    icon: <SchoolIcon color="primary" />,
    children: [
      {
        segment: 'sig',
        title: 'SIG & Topographie',
        icon: <LayersIcon />,
      },
      {
        segment: 'genie-civil',
        title: 'Génie Civil',
        icon: <EngineeringIcon />,
      },
      {
        segment: 'ihe',
        title: 'IHE',
        icon: <PublicIcon />,
      },
      {
        segment: 'ive',
        title: 'IVE',
        icon: <PublicIcon />,
      },
      {
        segment: 'meteo',
        title: 'Météorologie',
        icon: <WbSunnyIcon />,
      },
      {
        segment: 'genie-electrique',
        title: 'Génie Électrique',
        icon: <ElectricBoltIcon />,
      }
    ],
  },
  {
    segment: 'infrastructure',
    title: 'Infrastructure',
    icon: <HomeWorkIcon color="primary" />,
    children: [
      {
        segment: 'dortoirs',
        title: 'Dortoirs',
        icon: <HomeIcon />,
        children: [
          {
            segment: 'batiment-a',
            title: 'Bâtiment A',
            icon: <HomeIcon fontSize="small" />,
          },
          {
            segment: 'batiment-b',
            title: 'Bâtiment B',
            icon: <HomeIcon fontSize="small" />,
          },
          {
            segment: 'batiment-c',
            title: 'Bâtiment C',
            icon: <HomeIcon fontSize="small" />,
          },
          {
            segment: 'batiment-d',
            title: 'Bâtiment D',
            icon: <HomeIcon fontSize="small" />,
          },
          {
            segment: 'batiment-e',
            title: 'Bâtiment E',
            icon: <HomeIcon fontSize="small" />,
          },
          {
            segment: 'batiment-f',
            title: 'Bâtiment F',
            icon: <HomeIcon fontSize="small" />,
          }
        ]
      },
      {
        segment: 'restaurant',
        title: 'Restaurant Universitaire',
        icon: <RestaurantIcon />,
      },
      {
        segment: 'amphis',
        title: 'Amphithéâtres',
        icon: <SchoolIcon />,
        children: [
          {
            segment: 'amphi-1',
            title: 'Amphithéâtre 1',
            icon: <SchoolIcon fontSize="small" />,
          },
          {
            segment: 'amphi-2',
            title: 'Amphithéâtre 2',
            icon: <SchoolIcon fontSize="small" />,
          },
          {
            segment: 'amphi-3',
            title: 'Amphithéâtre 3',
            icon: <SchoolIcon fontSize="small" />,
          },
          {
            segment: 'amphi-4',
            title: 'Amphithéâtre 4',
            icon: <SchoolIcon fontSize="small" />,
          }
        ]
      },
      {
        segment: 'sport',
        title: 'Terrains de Sport',
        icon: <SoccerIcon />,
        children: [
          {
            segment: 'terrain-foot',
            title: 'Terrain de Football',
            icon: <SoccerIcon fontSize="small" />,
          },
          {
            segment: 'terrain-volley',
            title: 'Terrain de Volley',
            icon: <VolleyIcon fontSize="small" />,
          },
          {
            segment: 'terrain-basket',
            title: 'Terrain de Basketball',
            icon: <BasketballIcon fontSize="small" />,
          },
          {
            segment: 'terrain-tennis',
            title: 'Terrain de Tennis',
            icon: <TennisIcon fontSize="small" />,
          }
        ]
      },
      {
        segment: 'salles-sig',
        title: 'Salles SIG',
        icon: <LayersIcon />,
      },
      {
        segment: 'salles-gi',
        title: 'Salles Géomatique',
        icon: <MapOutlinedIcon />,
      }
    ],
  },
  {
    segment: 'services',
    title: 'Services',
    icon: <MiscellaneousServicesIcon color="primary" />,
    children: [
      {
        segment: 'bibliotheque',
        title: 'Bibliothèque',
        icon: <LibraryBooksIcon />,
      },
      {
        segment: 'buvette',
        title: 'Buvette',
        icon: <LocalBarIcon />,
      },
      {
        segment: 'administration',
        title: 'Administration',
        icon: <AdminPanelSettingsIcon />,
      }
    ],
  }
];



function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

/* const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
})); */

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const mousePositionRef = React.useRef(null)

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;


  return (
    <AppProvider
      router={router}
      theme={demoTheme}
      navigation={NAVIGATION}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{
          appTitle: () => (<>
            <CloudCircleIcon fontSize="large" color="primary" sx={{mr:1}}/> 
            <Typography variant="h5" component="div" color="primary" sx={{ fontWeight: 'bold' , paddingTop:"5px" }}>
            Jarar Maps
            </Typography>
            <CheckCircleIcon color="success" fontSize="small" sx={{mt:"10px",ml:"10px"}}/>
            </>
          ),
          sidebarFooter: () => (
            <Typography variant="caption" component="div" sx={{ pl: 1, pb: 1 }}>
              Powered by Geogueddari
            </Typography>
          ),

        }}
      >

<Typography variant="caption" component="div" ref={mousePositionRef}
            sx={{
                padding: "5px 10px",
                borderRadius: "0px 0px 4px 4px",
                fontSize: "18px",
                display: "inline-flex", // ou "flex" selon ton besoin
                alignItems: "center",
                zIndex: 2000,
                '&::before': {
                    content: '"WGS : "',
                    marginRight: '5px',
                    fontWeight: 'bold',
                    color: 'inherit',
                },
                backgroundColor:"rgb(25, 118, 210)",
                color:"white"
            }}
          >
            </Typography>

          
          <Map mousePositionRef={mousePositionRef}/>
          
            
      </DashboardLayout>
    </AppProvider>
  );
}
