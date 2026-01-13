import DashboardLayout from "@/shared/layouts/DashboardLayout.tsx";

function HomePage() {
    return (
        <DashboardLayout>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-6">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                <p className="text-muted-foreground">
                    Start managing your ESG data using the sidebar menu.
                </p>
            </div>
        </DashboardLayout>
    )
}

export default HomePage;