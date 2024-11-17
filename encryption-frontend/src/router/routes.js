import EncryptPage from 'pages/EncryptPage.vue'; // import your EncryptPage component

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', // The path you want to use for this page
        component: EncryptPage,
        name: 'EncryptPage'
      },
      // other routes...
    ]
  },
  // other routes...
];

export default routes;


// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/IndexPage.vue') }
//     ]
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue')
//   }
// ]

// export default routes
