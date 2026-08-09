using System;
using System.IO;

namespace SalesforceLoginAutomation.Core
{
    public static class Logger
    {
        private static readonly string LogFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ExecutionLog.txt");

        public static void Log(string message)
        {
            try
            {
                using (StreamWriter writer = new StreamWriter(LogFilePath, true))
                {
                    writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
