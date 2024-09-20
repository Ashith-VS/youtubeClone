import { lazy } from "react"
// import Home from "./Home"
// import Video from "./VideoPage"
// import Search from "./Search"
// import UploadVideo from "./UploadVideo"
// import LiveStreamming from "./LIveStreamming"
// import SignIn from "./Auth/SignIn"
// import SignUp from "./Auth/SignUp"
// import Profile from "./Profile"
// import GetStreaming from "./GetStreaming"

const Home = lazy(() => import('./Home'))
const Video = lazy(() => import('./VideoPage'))
const Search = lazy(() => import('./Search'))
const UploadVideo = lazy(() => import('./UploadVideo'))
const LiveStreamming = lazy(() => import('./LIveStreamming'))
const SignIn = lazy(() => import('./Auth/SignIn'))
const SignUp = lazy(() => import('./Auth/SignUp'))
const Profile = lazy(() => import('./Profile'))
const GetStreaming = lazy(() => import('./GetStreaming'))

export {
    Home,
    Video,
    Search,
    UploadVideo,
    LiveStreamming,
    SignIn,
    SignUp,
    Profile,
    GetStreaming
}