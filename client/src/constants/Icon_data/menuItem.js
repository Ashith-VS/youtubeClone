import HomeIcon from '@mui/icons-material/Home';
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";


export const menuItems = [
  {
    path: '/',
    icon: <HomeIcon />,
    label: 'Home',
    protected: false,
  },
  {
    path: '/trends',
    icon: <ExploreOutlinedIcon />,
    label: 'Explore',
    protected: false,
  },
  {
    path: '/subscriptions',
    icon: <SubscriptionsOutlinedIcon />,
    label: 'Subscriptions',
    protected: true,
  },
  {
    path: '/history',
    icon: <HistoryOutlinedIcon />,
    label: 'History',
    protected: false,
  },
];

export const categoryItems=[
  {
    path: '/music',
    icon: <LibraryMusicOutlinedIcon />,
    label: 'Music',
    protected: false,
  },
  {
    path: '/sports',
    icon: <SportsBasketballOutlinedIcon />,
    label: 'Sports',
    protected: false,
  },
  {
    path: '/game',
    icon: <SportsEsportsOutlinedIcon />,
    label: 'Gaming',
    protected: false,
  },
  {
    path: '/movies',
    icon: <MovieOutlinedIcon />,
    label: 'Movies',
    protected: false,
  },
  {
    path: '/news',
    icon: <ArticleOutlinedIcon />,
    label: 'News',
    protected: false,
  },
  {
    path: '/livelist',
    icon: <LiveTvOutlinedIcon />,
    label: 'Live',
    protected: true,
  }
]

export const settingsItems = [
  {
    path: '/settings',
    icon: <SettingsOutlinedIcon />,
    label: 'Settings',
    protected: false,
  },
  {
    path: '/report',
    icon: <FlagOutlinedIcon />,
    label: 'Report',
    protected: false,
  },
  {
    path: '/help',
    icon: <HelpOutlineOutlinedIcon />,
    label: 'Help',
    protected: false,
  },
]