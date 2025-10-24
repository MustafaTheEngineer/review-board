import { RenderMode, ServerRoute } from '@angular/ssr';

export const routesIDs: string[] = ['manage-id', 'item-id', ];

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'home/item/manage/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: 'home/item/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
];
