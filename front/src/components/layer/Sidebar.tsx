import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Divider,
    Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { liftWithBounce } from '../animation/Animations';
import { useThemeColors } from '../ThemeModeContext';
import type { ReactNode } from 'react';

interface NavItem {
    id: string;
    text: string;
    icon: ReactNode;
    path?: string; 
}

const Sidebar = () => {
    const title = 'TM';
    const colors = useThemeColors();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { t } = useTranslation();

    const handleSelect = (path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    const nav = {
        header: [
            { id: "sidebar_home", text: t('navigation.sidebar.home'), icon: <HomeRoundedIcon />, path: '/home' },
            { id: "sidebar_archive", text: t('navigation.sidebar.archive'), icon: <AssignmentIcon /> },
        ] as NavItem[],
        footer: [
            { id: "sidebar_documentation", text: t('navigation.sidebar.documentation'), icon: <AutoStoriesIcon /> },
        ] as NavItem[]
    };

    const isItemActive = (item: NavItem): boolean => {
        if (!item.path) return false;
        return currentPath.startsWith(item.path);
    };

    const renderNavItem = (item: NavItem) => (
        <ListItem key={item.id} id={item.id} disablePadding>
            <ListItemButton
                onClick={() => handleSelect(item.path)}
                disabled={!item.path} 
                sx={{
                    backgroundColor: isItemActive(item) ? colors.background.selected : "transparent",
                    borderRadius: "50px",
                    px: 2,
                    pl: 1,
                    color: isItemActive(item) ? colors.primary : colors.text.secondary,
                    cursor: item.path ? 'pointer' : 'default',
                    '&:hover': item.path ? {
                        color: colors.primary,
                        backgroundColor: colors.background.hover,
                    } : {},
                    '&.Mui-disabled': {
                        opacity: 0.7,
                        color: colors.text.tertiary,
                    }
                }}
            >
                <ListItemIcon sx={{
                    color: isItemActive(item) ? colors.iconSelected : colors.icon,
                    minWidth: '40px'
                }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: isItemActive(item) ? 600 : 400
                    }}
                />
            </ListItemButton>
        </ListItem>
    );

    return (
        <Stack sx={{
            px: 2,
            maxWidth: 150,
            height: '100vh',
            backgroundColor: colors.background.sidebar,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: `1px solid ${colors.border}`
        }}>
            <Box>
                <Typography variant="h5" sx={{
                    color: colors.text.primary,
                    fontWeight: 'bold',
                    my: 2,
                    textAlign: 'center',
                    fontFamily: 'Baggy Regular',
                    letterSpacing: '0.5rem',
                    textTransform: 'uppercase'
                }}>
                    {title.split('').map((letter, index) => (
                        <Box key={index} component="span" sx={liftWithBounce}>
                            {letter}
                        </Box>
                    ))}
                </Typography>
                <List dense>
                    {nav.header.map(renderNavItem)}
                </List>
            </Box>

            <Box>
                <Divider sx={{ my: 2, borderColor: colors.divider }} />
                <List dense>
                    {nav.footer.map(renderNavItem)}
                </List>
            </Box>
        </Stack>
    );
};

export default Sidebar;