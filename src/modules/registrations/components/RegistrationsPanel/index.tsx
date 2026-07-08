"use client";

import { useState } from "react";
import { Panel } from "@/shared/components/Panel";
import { CustomersForm } from "./CustomersForm";
import { ItemsForm } from "./ItemsForm";
import { TabButton } from "./TabButton";
import { TransportForm } from "./TransportForm";
import type { RegistrationTab } from "./types";

export function RegistrationsPanel() {
  const [tab, setTab] = useState<RegistrationTab>("customers");

  return (
    <Panel title="Cadastros básicos">
      <div aria-label="Tipos de cadastro" className="mb-4 inline-flex rounded-md border border-line bg-surface p-1" role="tablist">
        <TabButton active={tab === "customers"} controls="panel-customers" id="tab-customers" onClick={() => setTab("customers")}>
          Clientes
        </TabButton>
        <TabButton active={tab === "transports"} controls="panel-transports" id="tab-transports" onClick={() => setTab("transports")}>
          Transportes
        </TabButton>
        <TabButton active={tab === "items"} controls="panel-items" id="tab-items" onClick={() => setTab("items")}>
          Itens
        </TabButton>
      </div>

      {tab === "customers" && <CustomersForm />}
      {tab === "transports" && <TransportForm />}
      {tab === "items" && <ItemsForm />}
    </Panel>
  );
}
