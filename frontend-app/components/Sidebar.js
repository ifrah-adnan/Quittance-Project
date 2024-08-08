import React, { useState } from "react";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  HomeOutlined,
  PersonOutlined,
  DescriptionOutlined, // Import pour l'icône de contrat
} from "@mui/icons-material";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      onClose={toggleSidebar}
      sx={{
        width: open ? 240 : 64,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? 240 : 64,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          backgroundColor: "rgb(249, 250, 251)",
          borderRight: "1px solid rgb(229, 231, 235)",
        },
      }}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <IconButton onClick={toggleSidebar}>
          {open ? (
            <ChevronLeft className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="text-gray-600 dark:text-gray-400" />
          )}
        </IconButton>
      </div>
      <List className="py-4">
        <ListItem
          button
          component={Link}
          href="/properties"
          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ListItemIcon>
            {open ? (
              <HomeOutlined className="text-gray-600 dark:text-gray-400" />
            ) : (
              <HomeOutlined className="text-gray-600 dark:text-gray-400" />
            )}
          </ListItemIcon>
          {open && <ListItemText primary="Properties" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          href="/tenants"
          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ListItemIcon>
            {open ? (
              <PersonOutlined className="text-gray-600 dark:text-gray-400" />
            ) : (
              <PersonOutlined className="text-gray-600 dark:text-gray-400" />
            )}
          </ListItemIcon>
          {open && <ListItemText primary="Tenants" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          href="/contracts"
          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ListItemIcon>
            {open ? (
              <DescriptionOutlined className="text-gray-600 dark:text-gray-400" />
            ) : (
              <DescriptionOutlined className="text-gray-600 dark:text-gray-400" />
            )}
          </ListItemIcon>
          {open && <ListItemText primary="Contracts" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
