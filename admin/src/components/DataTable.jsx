import React from 'react';

const DataTable = ({ data, headers }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr className="w-full bg-gray-200 border-b border-gray-300">
                        {headers.map((header, index) => (
                            <th key={index} className="p-3 text-left text-gray-600">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                {Object.values(item).map((value, idx) => (
                                    <td key={idx} className="p-3 text-gray-600">
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="p-3 text-center text-gray-600">
                                No results found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
