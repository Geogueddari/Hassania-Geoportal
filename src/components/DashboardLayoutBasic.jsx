import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import SearchBar from './SearchBar';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';


import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';


import {
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
  BarChart as BarChartIcon,
  Description as DescriptionIcon,

  SportsSoccer as SoccerIcon,
  SportsVolleyball as VolleyIcon,
  SportsBasketball as BasketballIcon,
  SportsTennis as TennisIcon,

  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';



import Map from "./Map"
import Checkbox from "./CheckBox.jsx"

import "./DashboardLayoutBasic.css"


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
      default: '#e5e7eb', // beige  
      paper: '#e5e7eb',   // beige clair pour les composants sur fond 'paper' #F1F3F4
    },
  },
});


const NAVIGATION = [

  {
    kind: 'header',
    title: <SearchBar demoTheme={demoTheme} /> ,
    sx: {
      bgcolor: '#1a5276',
      color: 'white',
      fontWeight: 'bold',
      pl: 2,
      pt: 2,
      borderRadius: 1,
    },
  },
  {
    kind:"divider",
  },
  {
    kind: 'header',
    title:<>LIEUX & SERVICES</>

  },



  {
    segment: 'formations',
    title: 'Formations EHTP',
    icon: <SchoolIcon />,
    children: [
      {
        segment: 'sig',
        title: 'SIG & Topographie',
        icon: <Checkbox />,
        onclick: ()=>{console.log("clicked")},
        children: [
          { segment: 'sig-lab1', title: 'Laboratoire SIG 1', icon: <Checkbox size="small" /> },
          { segment: 'sig-lab2', title: 'Laboratoire SIG 2', icon: <Checkbox size="small" /> },
          { segment: 'sig-terrain', title: 'Terrain d\'application', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'genie-civil',
        title: 'Génie Civil',
        icon: <Checkbox />,
        children: [
          { segment: 'gc-labo-materiaux', title: 'Labo Matériaux', icon: <Checkbox size="small" /> },
          { segment: 'gc-labo-structures', title: 'Labo Structures', icon: <Checkbox size="small" /> },
          { segment: 'gc-salle-projet', title: 'Salle de projets', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'ihe',
        title: 'Hydraulique',
        icon: <Checkbox />,
        children: [
          { segment: 'ihe-labo-eau', title: 'Labo Hydrolique', icon: <Checkbox size="small" /> },
          { segment: 'ihe-labo-env', title: 'Labo environnement', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'ive',
        title: 'Ville & Environnement',
        icon: <Checkbox />,
        children: [
          { segment: 'ive-modelisation', title: 'Salle de modélisation', icon: <Checkbox size="small" /> },
          { segment: 'ive-salle-projet', title: 'Salle de projets', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'meteo',
        title: 'Météorologie',
        icon: <Checkbox />,
        children: [
          { segment: 'meteo-station', title: 'Station météo', icon: <Checkbox size="small" /> },
          { segment: 'meteo-labo', title: 'Laboratoire météo', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'genie-electrique',
        title: 'Génie Électrique',
        icon: <Checkbox />,
        children: [
          { segment: 'ge-labo-elec', title: 'Laboratoire électricité', icon: <Checkbox size="small" /> },
          { segment: 'ge-labo-auto', title: 'Laboratoire automatismes', icon: <Checkbox size="small" /> },
          { segment: 'ge-labo-reseaux', title: 'Laboratoire réseaux', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'informatique',
        title: 'Informatique & Réseaux',
        icon: <Checkbox />,
        children: [
          { segment: 'info-salle-tp', title: 'Salles TP', icon: <Checkbox size="small" /> },
          { segment: 'info-datacenter', title: 'Datacenter', icon: <Checkbox size="small" /> },
        ]
      }
    ]
  },
  {
    segment: 'batiments-academiques',
    title: 'Bâtiments Académiques',
    icon: <LibraryBooksIcon />,
    children: [
      {
        segment: 'amphis',
        title: 'Amphithéâtres',
        icon: <Checkbox />,
        children: Array.from({ length: 4 }, (_, i) => ({
          segment: `amphi-${i + 1}`,
          title: `Amphithéâtre ${i + 1}`,
          icon: <Checkbox size="small" />,
          description: `Capacité: ${(i + 1) * 100} places`
        }))
      },
      {
        segment: 'salles-cours',
        title: 'Salles de cours',
        icon: <Checkbox />,
        children: [
          { segment: 'salle-a1', title: 'Bloc A - RDC', icon: <Checkbox size="small" /> },
          { segment: 'salle-a2', title: 'Bloc A - 1er étage', icon: <Checkbox size="small" /> },
          { segment: 'salle-b1', title: 'Bloc B - RDC', icon: <Checkbox size="small" /> },
          { segment: 'salle-b2', title: 'Bloc B - 1er étage', icon: <Checkbox size="small" /> },
        ]
      },
      { segment: 'salles-sig', title: 'Salles SIG', icon: <Checkbox /> },
      { segment: 'salles-gi', title: 'Salles Géomatique', icon: <Checkbox /> },
      { segment: 'salles-informatique', title: 'Salles Informatique', icon: <Checkbox /> }
    ]
  },
  {
    segment: 'infrastructure',
    title: 'Logement & Restauration',
    icon: <HomeWorkIcon />,
    children: [
      {
        segment: 'dortoirs',
        title: 'Résidences étudiantes',
        icon: <HomeIcon />,
        children: ['a', 'b', 'c', 'd', 'e', 'f'].map((lettre) => ({
          segment: `batiment-${lettre}`,
          title: `Bâtiment ${lettre.toUpperCase()}`,
          icon: <Checkbox size="small" />,
          children: [
            { segment: `${lettre}-rdc`, title: 'Rez-de-chaussée', icon: <Checkbox size="small" /> },
            { segment: `${lettre}-1er`, title: '1er étage', icon: <Checkbox size="small" /> },
            { segment: `${lettre}-2eme`, title: '2ème étage', icon: <Checkbox size="small" /> }
          ]
        }))
      },
      {
        segment: 'restauration',
        title: 'Restauration',
        icon: <RestaurantIcon />,
        children: [
          { segment: 'restaurant-principal', title: 'Restaurant Universitaire', icon: <Checkbox size="small" /> },
          { segment: 'cafeteria', title: 'Cafétéria', icon: <Checkbox size="small" /> },
          { segment: 'buvette', title: 'Buvette', icon: <Checkbox size="small" /> },
        ]
      }
    ]
  },
  {
    segment: 'sport-loisirs',
    title: 'Sports & Loisirs',
    icon: <SoccerIcon />,
    children: [
      {
        segment: 'terrains-sport',
        title: 'Terrains de Sport',
        icon: <Checkbox />,
        children: [
          { segment: 'terrain-foot', title: 'Terrain de Football', icon: <Checkbox size="small" /> },
          { segment: 'terrain-foot-mini', title: 'Terrain de Mini-foot', icon: <Checkbox size="small" /> },
          { segment: 'terrain-volley', title: 'Terrain de Volley', icon: <Checkbox size="small" /> },
          { segment: 'terrain-basket', title: 'Terrain de Basketball', icon: <Checkbox size="small" /> },
          { segment: 'terrain-tennis', title: 'Courts de Tennis', icon: <Checkbox size="small" /> },
          { segment: 'piscine', title: 'Piscine', icon: <Checkbox size="small" /> }
        ]
      },
      {
        segment: 'salles-sport',
        title: 'Salles de Sport',
        icon: <Checkbox />,
        children: [
          { segment: 'salle-fitness', title: 'Salle de fitness', icon: <Checkbox size="small" /> },
          { segment: 'salle-arts-martiaux', title: 'Salle d\'arts martiaux', icon: <Checkbox size="small" /> },
          { segment: 'salle-polyvalente', title: 'Salle polyvalente', icon: <Checkbox size="small" /> }
        ]
      },
      {
        segment: 'espaces-loisirs',
        title: 'Espaces de loisirs',
        icon: <Checkbox />,
        children: [
          { segment: 'foyer-etudiants', title: 'Foyer des étudiants', icon: <Checkbox size="small" /> },
          { segment: 'salle-jeux', title: 'Salle de jeux', icon: <Checkbox size="small" /> },
          { segment: 'espace-detente', title: 'Espace détente', icon: <Checkbox size="small" /> }
        ]
      }
    ]
  },
  {
    segment: 'services',
    title: 'Services & Administration',
    icon: <MiscellaneousServicesIcon />,
    children: [
      {
        segment: 'bibliotheque',
        title: 'Bibliothèque',
        icon: <Checkbox />,
        children: [
          { segment: 'biblio-principale', title: 'Salle principale', icon: <Checkbox size="small" /> },
          { segment: 'biblio-multimedia', title: 'Espace multimédia', icon: <Checkbox size="small" /> },
          { segment: 'biblio-etude', title: 'Salles d\'étude', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'administration',
        title: 'Administration',
        icon: <AdminPanelSettingsIcon />,
        children: [
          { segment: 'admin-scolarite', title: 'Scolarité', icon: <Checkbox size="small" /> },
          { segment: 'admin-direction', title: 'Direction', icon: <Checkbox size="small" /> },
          { segment: 'admin-rh', title: 'Ressources humaines', icon: <Checkbox size="small" /> },
          { segment: 'admin-finance', title: 'Service financier', icon: <Checkbox size="small" /> },
          { segment: 'admin-international', title: 'Relations internationales', icon: <Checkbox size="small" /> },
        ]
      },
      {
        segment: 'sante',
        title: 'Services de santé',
        icon: <Checkbox />,
        children: [
          { segment: 'infirmerie', title: 'Infirmerie', icon: <Checkbox size="small" /> },
          { segment: 'cabinet-medical', title: 'Cabinet médical', icon: <Checkbox size="small" /> },
        ]
      },
      { segment: 'securite', title: 'Sécurité & Accueil', icon: <Checkbox /> },
      { segment: 'stationnement', title: 'Stationnements', icon: <Checkbox /> },
    ]
  },
  {
    kind: 'divider',
    sx: { my: 1, borderColor: '#1a5276' }
  },
  {
    kind: 'header',
    title: 'ENVIRONNEMENT',
    sx: {
      bgcolor: '#1a5276',
      color: 'white',
      fontWeight: 'bold',
      py: 1,
      pl: 2,
      borderRadius: 1
    }
  },
  {
    segment: 'developpement-durable',
    title: 'Développement Durable',
    icon: <WbSunnyIcon />,
    children: [
      { segment: 'panneaux-solaires', title: 'Installations solaires', icon: <Checkbox /> },
      { segment: 'recyclage', title: 'Points de recyclage', icon: <Checkbox /> },
      { segment: 'jardins', title: 'Jardins écologiques', icon: <Checkbox /> },
      { segment: 'station-traitement', title: 'Station de traitement des eaux', icon: <Checkbox /> }
    ]
  },
  {
    segment: 'espaces-verts',
    title: 'Espaces verts',
    icon: <LayersIcon />,
    children: [
      { segment: 'parc-central', title: 'Parc central', icon: <Checkbox /> },
      { segment: 'jardin-botanique', title: 'Jardin botanique', icon: <Checkbox /> },
      { segment: 'aire-pique-nique', title: 'Aires de pique-nique', icon: <Checkbox /> }
    ]
  },
  {
    kind: 'divider',
    sx: { my: 1, borderColor: '#1a5276' }
  },
  {
    kind: 'header',
    title: 'DONNÉES & STATISTIQUES',
    sx: {
      bgcolor: '#1a5276',
      color: 'white',
      fontWeight: 'bold',
      py: 1,
      pl: 2,
      borderRadius: 1
    }
  },
  {
    segment: 'statistiques',
    title: 'Statistiques',
    icon: <BarChartIcon />,
    children: [
      { segment: 'stats-occupation', title: 'Taux d\'occupation', icon: <Checkbox /> },
      { segment: 'stats-frequentation', title: 'Fréquentation des lieux', icon: <Checkbox /> },
      { segment: 'stats-energie', title: 'Consommation énergétique', icon: <Checkbox /> }
    ]
  },
  {
    segment: 'documentation',
    title: 'Documentation',
    icon: <DescriptionIcon />,
    children: [
      { segment: 'docs-plans', title: 'Plans architecturaux', icon: <Checkbox /> },
      { segment: 'docs-historique', title: 'Historique du campus', icon: <Checkbox /> },
      { segment: 'docs-reglement', title: 'Règlement intérieur', icon: <Checkbox /> }
    ]
  },
  {
    kind: 'divider',
    sx: { my: 1, borderColor: '#1a5276' }
  },
];



function useRouter(initialPath) {
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


function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" sx={{paddingRight:"8px"}}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};



const accounts = [
  {
    id: 1,
    name: 'Abdeljabbar Elgaddari',
    email: 'abdeljabbarelgaddari7@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
    projects: [
      {
        id: 3,
        title: 'Project B',
      },
    ],
  },
  {
    id: 2,
    name: 'Bouazzaoui yassin',
    email: 'bouazzaouiyassin@mui.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
    projects: [{ id: 4, title: 'Project A' }],
  },
];



function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                  bgcolor: account.color,
                }}
                src={account.image ?? ''}
                alt={account.name ?? ''}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}


const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};


function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 1,
              sx: {
                //overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};



const Session = {
  user: {
    name: 'Abdeljabbar Elgaddari',
    email: 'abdeljabarelgaddari7@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  },
  sx:{width: 32,
    height: 32,}
};





////////////////////////////////////////////////////////////////////////////////////////////


export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const mousePositionRef = React.useRef(null)

  const router = useRouter('/dashboard');

  const demoWindow = window ? window() : undefined;

  const [session, setSession] = React.useState(Session);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(session);
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
    <AppProvider
      router={router}
      theme={demoTheme}
      navigation={NAVIGATION}
      window={demoWindow}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{
          appTitle: () => (<>
            <TravelExploreIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="div" color="primary" sx={{ fontWeight: 'bold', paddingTop: "5px" }}>
              Jarar Maps
            </Typography>
            <CheckCircleIcon color="success" fontSize="small" sx={{ mt: "10px", ml: "10px" }} />
          </>
          ),
          toolbarAccount: () => null,
          sidebarFooter: () => (
            <SidebarFooterAccount />
          ),

        }}
      >

        <Map mousePositionRef={mousePositionRef} />


      </DashboardLayout>
    </AppProvider>
  );
}
