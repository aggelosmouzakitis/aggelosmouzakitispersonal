const URL_MAP = { 'home':'/', 'diagnostic':'/burnout-diagnostic/', 'blog':'/blog/', 'therapy-for-executives':'/therapy-for-executives/', 'therapy-for-founders':'/therapy-for-founders/', 'imposter-syndrome-therapy':'/imposter-syndrome-therapy/', 'executive-burnout-therapy':'/executive-burnout-therapy/', 'career-transition-therapy':'/career-transition-therapy/','ask-me-anything':'/ask-me-anything/' };
function SidebarApp() {
  const [open, setOpen] = React.useState(true);
  return <Sidebar page="blog" setPage={id => { window.location.href = URL_MAP[id] || '/'; }} open={open} setOpen={setOpen} />;
}
ReactDOM.createRoot(document.getElementById('sidebar-mount')).render(<SidebarApp />);
