export default [
  {
    icon: 'mdi-file-lock-outline',
    key: 'menu.auth',
    text: 'Auth Pages',
    regex: /^\/auth/,
    items: [
      {
        icon: 'mdi-login',
        key: 'menu.authLogin',
        text: 'Signin / Login',
        link: '/auth/signin',
      },
      {
        icon: 'mdi-logout',
        key: 'menu.authRegister',
        text: 'Signup / Register',
        link: '/auth/signup',
      },
      {
        icon: 'mdi-email-check',
        key: 'menu.authVerify',
        text: 'Signup / AuthVerify',
        link: '/auth/verify-email',
      },
    ],
  },
];
