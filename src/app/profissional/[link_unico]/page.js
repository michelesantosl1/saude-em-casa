import PaginaProfissional from './PaginaProfissional';

export default function Page({ params }) {
  return <PaginaProfissional linkUnico={params.link_unico} />;
}
