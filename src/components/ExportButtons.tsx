
import React from 'react';
import { Download, FileText, File, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Papa from 'papaparse';

interface ExtractedLink {
  id: string;
  url: string;
  message: string;
  user: string;
  date: string;
  domain: string;
}

interface ExportButtonsProps {
  data: ExtractedLink[];
  type: 'csv' | 'txt' | 'json';
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, type, variant = 'default', size = 'default' }) => {
  const exportToCsv = () => {
    const csvData = data.map(link => ({
      'URL': link.url,
      '도메인': link.domain,
      '사용자': link.user,
      '날짜': link.date,
      '메시지': link.message.replace(/(https?:\/\/[^\s]+)/g, '').trim()
    }));

    const csv = Papa.unparse(csvData, {
      header: true
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `카카오톡_링크_추출_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV 다운로드 완료",
      description: "파일이 성공적으로 다운로드되었습니다.",
    });
  };

  const exportToTxt = () => {
    let content = '=== 카카오톡 링크 추출 결과 ===\n\n';
    content += `추출 날짜: ${new Date().toLocaleString('ko-KR')}\n`;
    content += `총 링크 수: ${data.length}\n\n`;
    
    data.forEach((link, index) => {
      content += `${index + 1}. ${link.url}\n`;
      content += `   도메인: ${link.domain}\n`;
      content += `   사용자: ${link.user}\n`;
      content += `   날짜: ${link.date}\n`;
      content += `   메시지: ${link.message.replace(/(https?:\/\/[^\s]+)/g, '').trim()}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `카카오톡_링크_추출_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "TXT 다운로드 완료",
      description: "파일이 성공적으로 다운로드되었습니다.",
    });
  };

  const exportToJson = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalLinks: data.length,
      links: data.map(link => ({
        url: link.url,
        domain: link.domain,
        user: link.user,
        date: link.date,
        message: link.message.replace(/(https?:\/\/[^\s]+)/g, '').trim()
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `카카오톡_링크_추출_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "JSON 다운로드 완료",
      description: "파일이 성공적으로 다운로드되었습니다.",
    });
  };

  const handleExport = () => {
    switch(type) {
      case 'csv':
        exportToCsv();
        break;
      case 'txt':
        exportToTxt();
        break;
      case 'json':
        exportToJson();
        break;
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'csv':
        return <Table className="h-4 w-4" />;
      case 'txt':
        return <FileText className="h-4 w-4" />;
      case 'json':
        return <File className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch(type) {
      case 'csv':
        return 'CSV';
      case 'txt':
        return 'TXT';
      case 'json':
        return 'JSON';
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {getIcon()}
      {getLabel()}
    </Button>
  );
};

export default ExportButtons;
