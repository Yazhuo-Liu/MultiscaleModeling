import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { HomePage } from "@/pages/HomePage";
import { ModulePage } from "@/pages/ModulePage";
import "@/modules";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}>
      <div className="app-shell">
        <SiteHeader />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/m/:id" element={<ModulePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>
            Multiscale Modeling — 模块化介绍 / 渲染 / 计算框架。发布请打{" "}
            <code>vX.Y</code> 标签触发部署。
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
