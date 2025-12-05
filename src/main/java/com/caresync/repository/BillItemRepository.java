package com.caresync.repository;

import com.caresync.entity.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {

    List<BillItem> findByBillId(Long billId);

    void deleteByBillId(Long billId);
}
