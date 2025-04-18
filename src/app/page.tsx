import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {Icons} from '@/components/icons';
import Link from 'next/link';

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2>Guardian AI</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/text-moderation">
                  <SidebarMenuButton>
                    <Icons.messageSquare/>
                    <span>Text Moderation</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/audio-moderation">
                  <SidebarMenuButton>
                    <Icons.file/>
                    <span>Audio Moderation</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/visual-moderation">
                  <SidebarMenuButton>
                    <Icons.shield/>
                    <span>Visual Moderation</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/deepfake-detection">
                  <SidebarMenuButton>
                    <Icons.user/>
                    <span>Deepfake Detection</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground">
            Powered by Firebase Studio
          </p>
        </SidebarFooter>
      </Sidebar>
      <main className="flex flex-1 p-4">
        <div>
          {/* Main content will go here */}
          <h1>Moderation Dashboard</h1>
          <p>Select a moderation type from the sidebar to view results.</p>
        </div>
      </main>
    </SidebarProvider>
  );
}

