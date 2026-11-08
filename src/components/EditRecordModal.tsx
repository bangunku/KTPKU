import React, { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import { calculateAge, DEFAULT_HEADERS, getZodiacInfo } from '../utils/ktpUtils';

interface EditRecordModalProps {
  isOpen: boolean;
  isNewRecord: boolean;
  headers: string[];
  initialRow: string[];
  initialRemarks: string;
  onSave: (updatedRow: string[], remarks: string) => void;
  onClose: () => void;
}

const FIELD_PLACEHOLDERS: Record<string, string> = {
  NO: 'Contoh: 13',
  'NO. KK': '16 digit Nomor Kartu Keluarga (contoh: 3273011405090012)',
  NIK: '16 digit Nomor Induk Kependudukan (contoh: 3273011708780001)',
  NAMA: 'Nama lengkap sesuai KTP',
  'JENIS KELAMIN': 'LAKI-LAKI / PEREMPUAN',
  ALAMAT: 'Alamat lengkap RT/RW dan Kelurahan',
  'TEMPAT/TGL LAHIR': 'Contoh: BANDUNG, 17-08-1985',
  UMUR: 'Contoh: 41',
  AGAMA: 'Contoh: ISLAM / KRISTEN / KATOLIK / HINDU / BUDDHA',
  STATUS: 'Contoh: KAWIN / BELUM KAWIN / CERAI HIDUP / CERAI MATI',
  'HUBUNGAN KELUARGA': 'Contoh: KEPALA KELUARGA / ISTRI / ANAK',
  PENDIDIKAN: 'Contoh: SLTA / SEDERAJAT, S1 / STRATA-I',
  PEKERJAAN: 'Contoh: KARYAWAN SWASTA / WIRASWASTA / PELAJAR',
};

export const EditRecordModal: React.FC<EditRecordModalProps> = ({
  isOpen,
  isNewRecord,
  headers,
  initialRow,
  initialRemarks,
  onSave,
  onClose,
}) => {
  const effectiveHeaders = headers.length > 0 ? headers : DEFAULT_HEADERS;
  const [formValues, setFormValues] = useState<string[]>([]);
  const [remarks, setRemarks] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const normalized = effectiveHeaders.map((_, idx) => initialRow[idx] ?? '');
      setFormValues(normalized);
      setRemarks(initialRemarks || '');
      setValidationError(null);
    }
  }, [isOpen, initialRow, initialRemarks, effectiveHeaders.length]);

  if (!isOpen) return null;

  const handleFieldChange = (index: number, value: string) => {
    setFormValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nik = (formValues[2] || '').trim();
    const nama = (formValues[3] || '').trim();

    if (!nik || !nama) {
      setValidationError('Kolom NIK dan NAMA wajib diisi sebelum menyimpan data.');
      return;
    }

    onSave(formValues, remarks.trim());
  };

  const liveAge = calculateAge(formValues[6], formValues[7]);
  const liveZodiac = getZodiacInfo(formValues[6]);

  return (
    <div
      id="editModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70 shrink-0">
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isNewRecord ? 'Formulir Penambahan Data Baru' : 'Formulir Perubahan Data KTP'}
            </div>
            <h2 id="edit-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
              {isNewRecord ? 'Tambah Data Penduduk / Anggota KK' : 'Edit Data Penduduk'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal edit"
            className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {validationError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700"
              >
                {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {effectiveHeaders.map((header, index) => {
                const upperHeader = header.toUpperCase();
                const isFullWidth =
                  upperHeader.includes('ALAMAT') || upperHeader.includes('NAMA');

                return (
                  <div
                    key={`${header}-${index}`}
                    className={isFullWidth ? 'sm:col-span-2' : 'sm:col-span-1'}
                  >
                    <label
                      htmlFor={`field-${index}`}
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      {header}
                      {(index === 2 || index === 3) && (
                        <span className="text-red-600 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      id={`field-${index}`}
                      name={header}
                      type="text"
                      value={formValues[index] ?? ''}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={
                        FIELD_PLACEHOLDERS[upperHeader] || `Masukkan ${header}...`
                      }
                      className={`w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        index === 1 || index === 2 || index === 0 || index === 7
                          ? 'font-mono tabular-nums'
                          : ''
                      }`}
                    />
                    {index === 6 && (liveAge !== null || liveZodiac) && (
                      <div className="mt-1 text-[11px] text-slate-600 flex flex-wrap items-center gap-1.5">
                        {liveAge !== null && (
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">
                            Umur: {liveAge} thn
                          </span>
                        )}
                        {liveAge !== null && liveZodiac && (
                          <span aria-hidden="true">·</span>
                        )}
                        {liveZodiac && (
                          <span className="font-semibold text-amber-800">
                            Zodiak: {liveZodiac.symbol} {liveZodiac.name} (Elemen{' '}
                            {liveZodiac.element})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Remarks Textarea */}
              <div className="sm:col-span-2 pt-1">
                <label
                  htmlFor="edit-remarks"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Remarks / Catatan Verifikasi
                </label>
                <textarea
                  id="edit-remarks"
                  name="remarks"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Tambahkan catatan perubahan atau keterangan verifikasi lapangan..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
