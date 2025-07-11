import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ImageGuide from './ImageGuide';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): boolean => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "잘못된 파일 형식",
        description: "CSV 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      toast({
        title: "파일 크기 초과",
        description: "10MB 이하의 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'));

    if (!csvFile) {
      toast({
        title: "CSV 파일이 없습니다",
        description: "카카오톡 채팅 내보내기 CSV 파일을 드래그해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (validateFile(csvFile)) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <Card className={`transition-all duration-300 ${
      isDragOver 
        ? 'border-yellow-400 bg-yellow-50 scale-105' 
        : 'border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/50'
    }`}>
      <CardContent className="p-8">
        <div
          className="text-center space-y-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isProcessing 
              ? 'bg-blue-100 animate-pulse' 
              : isDragOver 
                ? 'bg-yellow-100' 
                : 'bg-gray-100'
          }`}>
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className={`h-8 w-8 ${isDragOver ? 'text-yellow-600' : 'text-gray-400'}`} />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isProcessing ? '파일 처리 중...' : '카카오톡 CSV 파일 업로드'}
            </h3>
            <p className="text-gray-600 mb-4">
              파일을 드래그하여 놓거나 아래 버튼을 클릭하세요
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
              disabled={isProcessing}
            />
            <label htmlFor="csv-upload">
              <Button 
                type="button" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                disabled={isProcessing}
              >
                <FileText className="mr-2 h-4 w-4" />
                파일 선택
              </Button>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm flex-1">
                <h4 className="font-medium text-blue-900 mb-1">카카오톡 CSV 파일 준비 방법:</h4>
                <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                  <li>카카오톡 채팅방 → 메뉴 → 대화 내보내기</li>
                  <li>텍스트 파일로 내보내기 → CSV 형식 선택</li>
                  <li>내보낸 CSV 파일을 여기에 업로드</li>
                </ol>
                <ImageGuide />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadZone;
