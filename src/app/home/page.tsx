'use client';

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
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const [selectedModeration, setSelectedModeration] = useState<string | null>(null);

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
                      <Icons.mic/>
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
                <SidebarMenuItem>
                  <Link href="/url-moderation">
                    <SidebarMenuButton>
                      <Icons.externalLink/>
                      <span>URL Moderation</span>
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
          <div className="w-full">
            {/* Main content will go here */}
            <h1 className="text-2xl font-bold mb-4">Moderation Dashboard</h1>
            <p className="mb-4">Select a moderation type from the sidebar to view results.</p>

            {selectedModeration && (
              <Card className="w-full">
                <CardContent>
                  <h2 className="text-lg font-bold mb-2">Selected Moderation: {selectedModeration}</h2>
                  {/* Display moderation results based on selectedModeration */}
                  <p>Results for {selectedModeration} will be displayed here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </SidebarProvider>
  );
}

export default Home;
