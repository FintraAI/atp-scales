// src/app/(portal)/files/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatFileSize } from '@/lib/utils'
import { FileText, Download, FolderOpen, Image, File } from 'lucide-react'
import type { FileType } from '@prisma/client'

const FILE_ICONS: Record<FileType, React.ElementType> = {
  PDF: FileText,
  IMAGE: Image,
  VIDEO: File,
  SPREADSHEET: File,
  DOCUMENT: FileText,
  OTHER: FolderOpen,
}

const FILE_COLORS: Record<FileType, string> = {
  PDF: 'text-red-400 bg-red-400/10',
  IMAGE: 'text-blue-400 bg-blue-400/10',
  VIDEO: 'text-purple-400 bg-purple-400/10',
  SPREADSHEET: 'text-emerald-400 bg-emerald-400/10',
  DOCUMENT: 'text-amber-400 bg-amber-400/10',
  OTHER: 'text-gray-400 bg-gray-400/10',
}

export default async function FilesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const isAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'TEAM_MEMBER'

  let clientProfileId = session.user.clientProfileId
  if (isAdmin && !clientProfileId) {
    const firstClient = await prisma.clientProfile.findFirst({ select: { id: true } })
    clientProfileId = firstClient?.id || null
  }

  if (!clientProfileId) {
    return <div className="text-[#888] text-sm">No client selected.</div>
  }

  const files = await prisma.clientFile.findMany({
    where: { clientProfileId },
    include: { uploadedBy: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  // Group by type
  const pdfFiles = files.filter((f) => f.fileType === 'PDF')
  const otherFiles = files.filter((f) => f.fileType !== 'PDF')

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Files & Reports</h1>
        <p className="text-[#888] text-sm mt-1">{files.length} file{files.length !== 1 ? 's' : ''} shared with you</p>
      </div>

      {files.length === 0 ? (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center">
          <FolderOpen className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">No files have been shared yet.</p>
        </div>
      ) : (
        <>
          {pdfFiles.length > 0 && (
            <FileSection title="Reports & Documents" files={pdfFiles} />
          )}
          {otherFiles.length > 0 && (
            <FileSection title="Other Files" files={otherFiles} />
          )}
        </>
      )}
    </div>
  )
}

function FileSection({ title, files }: { title: string; files: any[] }) {
  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1e1e1e]">
        <h2 className="font-display font-semibold text-white text-base">{title}</h2>
      </div>
      <div className="divide-y divide-[#1a1a1a]">
        {files.map((file) => {
          const Icon = FILE_ICONS[file.fileType as FileType] || File
          const colorClass = FILE_COLORS[file.fileType as FileType] || FILE_COLORS.OTHER
          return (
            <div key={file.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-[13px] truncate">{file.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {file.description && (
                    <p className="text-[12px] text-[#555] truncate max-w-[300px]">{file.description}</p>
                  )}
                  <span className="text-[11px] text-[#444]">
                    {file.size ? formatFileSize(file.size) : '—'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] text-[#555]">{formatDate(file.createdAt)}</p>
                  <p className="text-[11px] text-[#444]">{file.uploadedBy?.name || 'ATP Scales'}</p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] hover:bg-[#c8ff00]/10 hover:text-[#c8ff00] border border-[#1e1e1e] hover:border-[#c8ff00]/20 rounded-lg text-[12px] text-[#888] font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
