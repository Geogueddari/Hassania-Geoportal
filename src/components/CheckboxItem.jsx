import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function transformNavigationToCheckboxes(navigation, checkedItems = {}, setCheckedItems = () => {}) {
  return navigation.map((item) => {
    if (item.kind === 'header' || item.kind === 'divider') {
      return item;
    }

    // Si c'est un élément parent avec des enfants
    if (item.children) {
      return {
        ...item,
        icon: item.icon, // Garder l'icône du parent
        children: item.children.map((child) => {
          // Si l'enfant a aussi des enfants => récursion
          if (child.children) {
            return {
              ...child,
              icon: child.icon,
              children: child.children.map((nestedChild) =>
                transformLeafToCheckbox(nestedChild, checkedItems, setCheckedItems)
              )
            };
          }
          // Sinon, transformer en checkbox
          return transformLeafToCheckbox(child, checkedItems, setCheckedItems);
        }),
      };
    }

    // Si c’est un élément enfant sans enfants, on le transforme en checkbox
    return transformLeafToCheckbox(item, checkedItems, setCheckedItems);
  });
}

function transformLeafToCheckbox(item, checkedItems, setCheckedItems) {
  const isChecked = checkedItems[item.segment] || false;

  return {
    ...item,
    icon: null, // Supprimer l’icône
    renderItem: () => (
      <Box display="flex" alignItems="center" pl={1}>
        <Checkbox
          size="small"
          checked={isChecked}
          onChange={(e) => {
            setCheckedItems((prev) => ({
              ...prev,
              [item.segment]: e.target.checked,
            }));
          }}
        />
        <Typography variant="body2">{item.title}</Typography>
      </Box>
    ),
  };
}
