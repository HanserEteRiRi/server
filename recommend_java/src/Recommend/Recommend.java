package Recommend;

import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.common.LongPrimitiveIterator;
import org.apache.mahout.cf.taste.impl.model.file.FileDataModel;
import org.apache.mahout.cf.taste.impl.neighborhood.NearestNUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.recommender.svd.ALSWRFactorizer;
import org.apache.mahout.cf.taste.impl.recommender.svd.SVDRecommender;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.Recommender;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class Recommend {
    /**
     * @param args [0] is samples file name and the file need to be located as the same directory
     *                 as .jar
     *             [1] is id of user need recommendation
     *             [2] is the number of need of recommended items
     * output file is located at the same directory as .jar which format is the name of recommended
     * items separated with ;
     */
    public static void main(String[] args) {
        HashTackle map = new HashTackle();
        String rawFileName = args[0];
        map.makeHash(rawFileName);
        String hashedFileName = "hashedData.csv";
        try {
            DataModel model = new FileDataModel(new File(hashedFileName));
            // UserSimilarity similarity = new PearsonCorrelationSimilarity(model);
            // UserNeighborhood neighborhood = new NearestNUserNeighborhood(3, similarity, model);
            Recommender recommender = new SVDRecommender(model,
                    new ALSWRFactorizer(model, 10, 0.05, 10));
//           Recommender recommender = new GenericUserBasedRecommender(
//                model, neighborhood, similarity);
            List<RecommendedItem> recommendList = recommender.recommend(Integer.parseInt(args[1]),
                    Integer.parseInt(args[2]));
            String outFileName = "recommendItems.txt";
            PrintWriter writer = new PrintWriter(new FileWriter(new File(outFileName), false));
            writer.print("");
            writer.flush();
            writer.close();
            writer = new PrintWriter(new FileWriter(new File(outFileName), true));
            for (RecommendedItem i : recommendList) {
                writer.print(map.hashReverse((int) i.getItemID()) + ";");
            }
            writer.flush();
            writer.close();
//            LongPrimitiveIterator iterator = model.getUserIDs();
//            while (iterator.hasNext()) {
//                long uid = iterator.nextLong();
//                List<RecommendedItem> recommendList = recommender.recommend(uid, 3);
//                System.out.println("uid:" + uid + " recom:");
//                for (RecommendedItem i : recommendList) {
//                    System.out.println("    " + map.hashReverse((int) i.getItemID()));
//                }
//            }
//           List<RecommendedItem> recommendList = recommender.recommend(6, 3);
//           System.out.println(recommendList);}
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } catch (TasteException te) {
            te.printStackTrace();
        }
    }
}
