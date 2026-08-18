// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/InvoicesView.tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/InvoicesView (1).tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/InvoicesView.tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/InvoicesView (2).tsx
================================================================================

import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/InvoicesView (1).tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/InvoicesView.tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/InvoicesView_1.tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/InvoicesView (2).tsx
================================================================================

import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/InvoicesView.tsx
================================================================================

import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/InvoicesView (1).tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/InvoicesView.tsx
================================================================================


import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/InvoicesView (2).tsx
================================================================================

import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './common/DataTable';
import { Badge } from './ui/badge';

const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Loading...</div>
    }

    const { invoices } = context;

    const columns = React.useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Invoice #',
        },
        {
            accessorKey: 'counterpartyName',
            header: 'Counterparty',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'destructive' : 'secondary';
                return <Badge variant={variant as any}>{status}</Badge>
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
            <Card>
                <DataTable 
                    columns={columns} 
                    data={invoices} 
                    filterColumn='counterpartyName'
                    placeholder='Filter by counterparty...'
                />
            </Card>
        </div>
    );
}

export default InvoicesView;