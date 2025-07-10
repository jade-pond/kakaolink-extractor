
import React from 'react';
import { Download, FileText, File, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data }) => {
  const exportToCsv = () => {
    const csvData = data.map(link => ({
      'URL': link.url,
      '도메인': link.domain,
      '사용자': link.user,
      '날짜': link.date,
      '메시지': link.message
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      encoding: 'utf-8'
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
      content += `   메시지: ${link.message}\n\n`;
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
        message: link.message
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

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={exportToCsv}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <Table className="mr-2 h-4 w-4" />
            CSV 다운로드
          </Button>
          
          <Button
            onClick={exportToTxt}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <FileText className="mr-2 h-4 w-4" />
            TXT 다운로드
          </Button>
          
          <Button
            onClick={exportToJson}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <File className="mr-2 h-4 w-4" />
            JSON 다운로드
          </Button>
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-3">
          데이터를 다양한 형태로 내보내어 활용하세요
        </p>
      </CardContent>
    </Card>
  );
};

export default ExportButtons;
