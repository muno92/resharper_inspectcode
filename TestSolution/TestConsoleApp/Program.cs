using System;

namespace TestConsoleApp
{
    class Program
    {
        public static string canBePrivate = "hello";

        private static int unusedField = 0;

        static void Main(string[] args)
        {
            var unusedVariable = 1;

            Console.WriteLine(canBePrivate);
        }
    }
}
