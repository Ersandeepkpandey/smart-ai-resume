// Layout wrapper removed to prevent duplicate navigation
// Each admin page already uses AdminLayout component

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}