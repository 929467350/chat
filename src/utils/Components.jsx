import loadable from 'loadable-components'
export const Home = loadable( () => import( '../pages/Home' ) );
export const Login = loadable( () => import( '../pages/Login' ) );
export const Error = loadable( () => import( '../pages/Error' ) );