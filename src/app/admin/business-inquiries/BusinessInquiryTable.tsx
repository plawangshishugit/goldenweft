"use client";

import { Text } from "@/components/ui/Text";

export default function BusinessInquiryTable({
  inquiries,
  onResolve,
}: {
  inquiries: any[];
  onResolve: (id: string) => void;
}) {
  return (
    <div className="mt-6 space-y-4">
      {inquiries.map((inq) => (
        <div
          key={inq.id}
          className="border border-black/10 rounded-soft p-4"
        >
          <div className="flex justify-between">
            <div>
              <Text className="font-medium">
                {inq.name} {inq.company && `(${inq.company})`}
              </Text>
              <Text className="text-sm opacity-70">{inq.email}</Text>
              <Text className="mt-2 text-sm">{inq.message}</Text>
              <Text className="mt-2 text-xs opacity-60">
                {new Date(inq.createdAt).toISOString()}
              </Text>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  inq.resolved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {inq.resolved ? "Resolved" : "Open"}
              </span>

              {!inq.resolved && (
                <button
                  className="text-xs underline"
                  onClick={() => onResolve(inq.id)}
                >
                  Mark resolved
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
