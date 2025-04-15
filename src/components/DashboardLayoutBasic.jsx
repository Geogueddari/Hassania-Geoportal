import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import Typography from '@mui/material/Typography';
//import Grid from '@mui/material/Grid';





import Map from "./Map"

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Map Type',
  },
  {
    title: '2D',
    segment: '2D',
    icon: <MapIcon />,
  },
  {
    segment: '3D',
    title: '3D',
    icon: <ViewInArOutlinedIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Layers',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

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
});

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

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;


  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{
          appTitle: () => (
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' , color:"rgb(25, 118, 210)", paddingTop:"5px" }}>
              Jarar Maps
            </Typography>
          ),
          sidebarFooter: () => (
            <Typography variant="caption" component="div" sx={{ pl: 1, pb: 1 }}>
              Powered by Geogueddari
            </Typography>
          ),
        }}
      >
          <Map />
      </DashboardLayout>
    </AppProvider>
  );
}
