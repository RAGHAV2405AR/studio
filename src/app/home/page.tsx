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
import Chatbot from '@/components/chatbot';

const Home = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

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
                      <span>Text Analysis</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/audio-moderation">
                    <SidebarMenuButton>
                      <Icons.mic/>
                      <span>Audio Analysis</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/visual-moderation">
                    <SidebarMenuButton>
                      <Icons.shield/>
                      <span>Visual Analysis</span>
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
                      <span>URL Analysis</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-xs text-muted-foreground">
              Powered by THE DUO.
            </p>
          </SidebarFooter>
        </Sidebar>
        <main className="flex flex-1 p-4">
          <div className="w-full">
            {/* Main content will go here */}
            <h1 className="text-2xl font-bold mb-4">Content Analysis Dashboard</h1>
            <p className="mb-4">Select an analysis type from the sidebar to view results.</p>

            {selectedAnalysis && (
              <Card className="w-full">
                <CardContent>
                  <h2 className="text-lg font-bold mb-2">Selected Analysis: {selectedAnalysis}</h2>
                  {/* Display analysis results based on selectedAnalysis */}
                  <p>Results for {selectedAnalysis} will be displayed here.</p>
                </CardContent>
              </Card>
            )}
            <Chatbot/>
          </div>
        </main>
      </SidebarProvider>
  );
}

export default Home;

