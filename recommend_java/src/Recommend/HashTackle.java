package Recommend;

import com.csvreader.CsvReader;
import com.csvreader.CsvWriter;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

public class HashTackle {
    private List<String> songsAndSingers;

    public HashTackle() {
        songsAndSingers = new ArrayList<>();
    }

    public void makeHash(String fileName) {
        try {
            CsvReader csvReader = new CsvReader(fileName, ',', Charset.forName("utf-8"));
            while (csvReader.readRecord()) {
                String songAndSinger = csvReader.get(1);
                if (!songsAndSingers.contains(songAndSinger)) {
                    songsAndSingers.add(songAndSinger);
                }
            }
            String desFileName = "hashedData.csv";
            CsvWriter csvWriter = new CsvWriter(desFileName, ',', Charset.forName("utf-8"));
            List<String> newRecord = null;
            String[] t = null;
            csvReader = new CsvReader(fileName, ',', Charset.forName("utf-8"));
            while (csvReader.readRecord()) {
                newRecord = new ArrayList<>();
                newRecord.add(csvReader.get(0));
                newRecord.add(String.valueOf(songsAndSingers.indexOf(csvReader.get(1))));
                newRecord.add(csvReader.get(2));
                t = new String[newRecord.size()];
                newRecord.toArray(t);
                csvWriter.writeRecord(t);
            }
            csvReader.close();
            csvWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String hashReverse(int i) {
        return songsAndSingers.get(i);
    }
}
